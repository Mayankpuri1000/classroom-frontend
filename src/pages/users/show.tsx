import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, UserRole } from '@/types';
import { useShow } from '@refinedev/core';
import { useNavigate, useParams } from 'react-router';
import { User as UserIcon, Mail } from 'lucide-react';

const UsersShow = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { query } = useShow<User>({ resource: 'users', id });
    const user = query.data?.data;
    const { isLoading, isError } = query;

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case UserRole.ADMIN: return 'destructive';
            case UserRole.TEACHER: return 'default';
            case UserRole.STUDENT: return 'secondary';
            default: return 'outline';
        }
    };

    if (isLoading || isError || !user) {
        return (
            <ShowView className="user-show">
                <ShowViewHeader resource="users" title="User Details" />
                <p className="state-message">
                    {isLoading ? 'Loading user...' : isError ? 'Failed to load user' : 'User not found'}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="user-show">
            <ShowViewHeader resource="users" title="User Details" />

            <Card className="p-6 sm:p-8 space-y-6 shadow-md mt-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                <UserIcon className="w-10 h-10 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/users')}
                        >
                            Back to List
                        </Button>
                    </div>
                </div>

                <div className="border-t pt-6 grid sm:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                            Account Information
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">User ID:</span>
                                <span className="ml-2 font-mono">{user.id}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Email Verified:</span>
                                <span className="ml-2">{user.emailVerified ? 'Yes' : 'No'}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Created:</span>
                                <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span className="ml-2">{new Date(user.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {user.role === UserRole.TEACHER && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                                Teaching Overview
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                View classes taught by this instructor in the Classes section.
                            </p>
                        </div>
                    )}

                    {user.role === UserRole.STUDENT && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                                Enrollment Overview
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                View enrolled classes in the user's profile.
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </ShowView>
    );
};

export default UsersShow;
