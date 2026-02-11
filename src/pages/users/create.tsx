import { CreateView, CreateViewHeader } from '@/components/refine-ui/views/create-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/types';
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate } from 'react-router';
import { Controller } from 'react-hook-form';

const UsersCreate = () => {
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        refineCore: { onFinish }
    } = useForm({
        refineCoreProps: {
            resource: 'users',
            action: 'create',
            redirect: 'list'
        }
    });

    const onSubmit = async (data: any) => {
        await onFinish(data);
    };

    return (
        <CreateView className="user-create">
            <CreateViewHeader resource="users" title="Create User" />

            <Card className="class-form-card">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Controller
                            name="role"
                            control={control}
                            rules={{ required: 'Role is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                                        <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role && (
                            <p className="text-sm text-destructive">{errors.role.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                            id="image"
                            {...register('image')}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <p className="text-xs text-muted-foreground">Optional: Enter a URL to a profile image</p>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/users')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Card>
        </CreateView>
    );
};

export default UsersCreate;
