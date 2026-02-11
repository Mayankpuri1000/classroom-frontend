import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Subject, ClassDetails } from '@/types';
import { useShow, useList } from '@refinedev/core';
import { useNavigate, useParams } from 'react-router';
import { BookOpen } from 'lucide-react';

const SubjectsShow = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { query } = useShow<Subject>({ resource: 'subjects', id });
    const subject = query.data?.data;
    const { isLoading, isError } = query;

    // Fetch classes for this subject
    const classesListResult = useList<ClassDetails>({
        resource: 'classes',
        filters: id ? [{ field: 'subject', operator: 'eq', value: id }] : [],
        pagination: { pageSize: 100 }
    });

    const classes = classesListResult.result?.data || [];

    if (isLoading || isError || !subject) {
        return (
            <ShowView className="subject-show">
                <ShowViewHeader resource="subjects" title="Subject Details" />
                <p className="state-message">
                    {isLoading ? 'Loading subject...' : isError ? 'Failed to load subject' : 'Subject not found'}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="subject-show">
            <ShowViewHeader resource="subjects" title="Subject Details" />

            <Card className="p-6 sm:p-8 space-y-6 shadow-md mt-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-blue-100">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{subject.name}</h1>
                                <Badge variant="outline" className="font-mono">{subject.code}</Badge>
                            </div>
                            <p className="text-muted-foreground">{subject.description || 'No description provided'}</p>
                            {subject.department && (
                                <div className="mt-2">
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/departments/show/${subject.department?.id}`)}
                                    >
                                        {subject.department.name}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/subjects/edit/${subject.id}`)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/subjects')}
                        >
                            Back to List
                        </Button>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            Classes ({classes.length})
                        </h2>
                        <Button size="sm" onClick={() => navigate('/classes/create')}>
                            Add Class
                        </Button>
                    </div>

                    {classes.length > 0 ? (
                        <div className="grid gap-3">
                            {classes.map((classItem: ClassDetails) => (
                                <Card
                                    key={classItem.id}
                                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/classes/show/${classItem.id}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold">{classItem.name}</p>
                                                <Badge variant={classItem.status === 'active' ? 'default' : 'secondary'}>
                                                    {classItem.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {classItem.description || 'No description'}
                                            </p>
                                            {classItem.teacher && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Teacher: {classItem.teacher.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-sm text-muted-foreground">
                                            <p>Capacity: {classItem.capacity}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No classes for this subject yet.
                        </p>
                    )}
                </div>

                <div className="border-t pt-4 text-sm text-muted-foreground">
                    <p>Created: {subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : 'N/A'}</p>
                    <p>Last updated: {subject.updatedAt ? new Date(subject.updatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
            </Card>
        </ShowView>
    );
};

export default SubjectsShow;
