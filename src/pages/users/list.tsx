import { ListView } from '@/components/refine-ui/views/list-view';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTable } from '@refinedev/react-table';
import { useList } from '@refinedev/core';
import { ColumnDef } from '@tanstack/react-table';
import { User, UserRole } from '@/types';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';

const UsersList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');

    const filters = [];
    if (search) filters.push({ field: 'search', operator: 'contains', value: search });
    if (roleFilter) filters.push({ field: 'role', operator: 'eq', value: roleFilter });

    const { data: usersData, isLoading } = useList<User>({
        resource: 'users',
        filters,
        pagination: { current: 1, pageSize: 20 }
    });

    const users = usersData?.data || [];

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case UserRole.ADMIN: return 'destructive';
            case UserRole.TEACHER: return 'default';
            case UserRole.STUDENT: return 'secondary';
            default: return 'outline';
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.image && (
                        <img
                            src={row.original.image}
                            alt={row.original.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    )}
                    <span className="font-medium">{row.original.name}</span>
                </div>
            )
        },
        {
            id: 'email',
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">{row.original.email}</span>
            )
        },
        {
            id: 'role',
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => (
                <Badge variant={getRoleBadgeVariant(row.original.role)}>
                    {row.original.role}
                </Badge>
            )
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: 'Joined',
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </span>
            )
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/users/show/${row.original.id}`)}
                    >
                        View
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/users/edit/${row.original.id}`)}
                    >
                        Edit
                    </Button>
                </div>
            )
        }
    ];

    const table = useTable({
        columns,
        data: users,
    });

    return (
        <ListView title="Users" resource="users">
            <div className="intro-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="actions-row">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                            <SelectItem value={UserRole.TEACHER}>Teacher</SelectItem>
                            <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={() => navigate('/users/create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create User
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <p className="text-center text-muted-foreground mt-8">Loading users...</p>
            ) : (
                <DataTable table={table} columns={columns} />
            )}
        </ListView>
    );
};

export default UsersList;
