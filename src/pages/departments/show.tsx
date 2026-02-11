import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Department, Subject } from '@/types';
import { useShow, useList } from '@refinedev/core';
import { useNavigate, useParams } from 'react-router';
import { Building2 } from 'lucide-react';

const DepartmentsShow = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { query } = useShow<Department>({ resource: 'departments', id });
    const department = query.data?.data;
    const { isLoading, isError } = query;

    // Fetch subjects for this department
    const subjectsListResult = useList<Subject>({
        resource: 'subjects',
        filters: id ? [{ field: 'departmentId', operator: 'eq', value: id }] : [],
        pagination: { pageSize: 100 }
    });

    const subjects = subjectsListResult.result?.data || [];

    if (isLoading || isError || !department) {
        return (
            <ShowView className="department-show">
                <ShowViewHeader resource="departments" title="Department Details" />
                <p className="state-message">
                    {isLoading ? 'Loading department...' : isError ? 'Failed to load department' : 'Department not found'}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="department-show">
            <ShowViewHeader resource="departments" title="Department Details" />

            <Card className="p-6 sm:p-8 space-y-6 shadow-md mt-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-purple-100">
                            <Building2 className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{department.name}</h1>
                                <Badge variant="outline" className="font-mono">{department.code}</Badge>
                            </div>
                            <p className="text-muted-foreground">{department.description || 'No description provided'}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/departments/edit/${department.id}`)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/departments')}
                        >
                            Back to List
                        </Button>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            Subjects ({subjects.length})
                        </h2>
                        <Button size="sm" onClick={() => navigate('/subjects/create')}>
                            Add Subject
                        </Button>
                    </div>

                    {subjects.length > 0 ? (
                        <div className="grid gap-3">
                            {subjects.map((subject: Subject) => (
                                <Card
                                    key={subject.id}
                                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/subjects/show/${subject.id}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold">{subject.name}</p>
                                                <Badge variant="outline" className="font-mono text-xs">{subject.code}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {subject.description || 'No description'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No subjects in this department yet.
                        </p>
                    )}
                </div>

                <div className="border-t pt-4 text-sm text-muted-foreground">
                    <p>Created: {new Date(department.createdAt).toLocaleDateString()}</p>
                    <p>Last updated: {new Date(department.updatedAt).toLocaleDateString()}</p>
                </div>
            </Card>
        </ShowView>
    );
};

export default DepartmentsShow;
