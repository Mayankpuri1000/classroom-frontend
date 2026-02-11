import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@refinedev/react-hook-form';
import { useList } from '@refinedev/core';
import { useNavigate, useParams } from 'react-router';
import { Controller } from 'react-hook-form';
import { Subject, User } from '@/types';

const ClassesEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const subjectsListResult = useList<Subject>({
        resource: 'subjects',
        pagination: { pageSize: 100 }
    });

    const teachersListResult = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
        pagination: { pageSize: 100 }
    });

    const subjects = subjectsListResult.result?.data || [];
    const teachers = teachersListResult.result?.data || [];
    const subjectsLoading = subjectsListResult.query.isLoading;
    const teachersLoading = teachersListResult.query.isLoading;

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        refineCore: { onFinish, query }
    } = useForm({
        refineCoreProps: {
            resource: 'classes',
            action: 'edit',
            id,
            redirect: 'show'
        }
    });

    const isLoading = query?.isLoading || subjectsLoading || teachersLoading;

    const onSubmit = async (data: any) => {
        // Convert IDs to proper types
        const payload = {
            ...data,
            subjectId: Number(data.subjectId),
            capacity: Number(data.capacity) || 50
        };
        await onFinish(payload);
    };

    if (isLoading) {
        return (
            <EditView className="class-edit">
                <EditViewHeader resource="classes" title="Edit Class" />
                <p className="text-center text-muted-foreground mt-8">Loading class...</p>
            </EditView>
        );
    }

    return (
        <EditView className="class-edit">
            <EditViewHeader resource="classes" title="Edit Class" />

            <Card className="class-form-card">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Class name is required' })}
                            placeholder="e.g., Fall 2024 - Section A"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subjectId">Subject *</Label>
                        <Controller
                            name="subjectId"
                            control={control}
                            rules={{ required: 'Subject is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject: Subject) => (
                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                {subject.name} ({subject.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.subjectId && (
                            <p className="text-sm text-destructive">{errors.subjectId.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="teacherId">Teacher *</Label>
                        <Controller
                            name="teacherId"
                            control={control}
                            rules={{ required: 'Teacher is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher: User) => (
                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.teacherId && (
                            <p className="text-sm text-destructive">{errors.teacherId.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Describe the class..."
                            rows={3}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity *</Label>
                            <Input
                                id="capacity"
                                type="number"
                                {...register('capacity', {
                                    required: 'Capacity is required',
                                    min: { value: 1, message: 'Capacity must be at least 1' }
                                })}
                                placeholder="50"
                            />
                            {errors.capacity && (
                                <p className="text-sm text-destructive">{errors.capacity.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: 'Status is required' }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status.message as string}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/classes/show/${id}`)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </EditView>
    );
};

export default ClassesEdit;
