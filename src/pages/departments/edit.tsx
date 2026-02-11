import { EditView, EditViewHeader } from '@/components/refine-ui/views/edit-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate, useParams } from 'react-router';

const DepartmentsEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        refineCore: { onFinish, query }
    } = useForm({
        refineCoreProps: {
            resource: 'departments',
            action: 'edit',
            id,
            redirect: 'list'
        }
    });

    const isLoading = query?.isLoading;

    const onSubmit = async (data: any) => {
        await onFinish(data);
    };

    if (isLoading) {
        return (
            <EditView className="department-edit">
                <EditViewHeader resource="departments" title="Edit Department" />
                <p className="text-center text-muted-foreground mt-8">Loading department...</p>
            </EditView>
        );
    }

    return (
        <EditView className="department-edit">
            <EditViewHeader resource="departments" title="Edit Department" />

            <Card className="class-form-card">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="code">Department Code *</Label>
                        <Input
                            id="code"
                            {...register('code', { required: 'Department code is required' })}
                            placeholder="e.g., CS, MATH, ENG"
                            className="font-mono"
                        />
                        {errors.code && (
                            <p className="text-sm text-destructive">{errors.code.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Department name is required' })}
                            placeholder="e.g., Computer Science"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Describe the department..."
                            rows={4}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/departments')}
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

export default DepartmentsEdit;
