import { CreateView, CreateViewHeader } from '@/components/refine-ui/views/create-view';
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
import { useNavigate } from 'react-router';
import { Controller } from 'react-hook-form';
import { Department } from '@/types';

const SubjectsCreate = () => {
  const navigate = useNavigate();

  const departmentsListResult = useList<Department>({
    resource: 'departments',
    pagination: { pageSize: 100 }
  });

  const departments = departmentsListResult.result?.data || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    refineCore: { onFinish }
  } = useForm({
    refineCoreProps: {
      resource: 'subjects',
      action: 'create',
      redirect: 'list'
    }
  });

  const onSubmit = async (data: any) => {
    // Convert departmentId to number
    const payload = {
      ...data,
      departmentId: Number(data.departmentId)
    };
    await onFinish(payload);
  };

  return (
    <CreateView className="subject-create">
      <CreateViewHeader resource="subjects" title="Create Subject" />

      <Card className="class-form-card">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Subject Code *</Label>
            <Input
              id="code"
              {...register('code', { required: 'Subject code is required' })}
              placeholder="e.g., CS101, MATH201"
              className="font-mono"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Subject name is required' })}
              placeholder="e.g., Introduction to Programming"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departmentId">Department *</Label>
            <Controller
              name="departmentId"
              control={control}
              rules={{ required: 'Department is required' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept: Department) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.departmentId && (
              <p className="text-sm text-destructive">{errors.departmentId.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe the subject..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/subjects')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Card>
    </CreateView>
  );
};

export default SubjectsCreate;