import { ListView, ListViewHeader } from '@/components/refine-ui/views/list-view';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTable } from '@refinedev/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { Department } from '@/types';
import { Search, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';

const DepartmentsList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const columns = useMemo<ColumnDef<Department>[]>(() => [
        {
            id: 'code',
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => (
                <span className="font-mono font-semibold text-primary">{row.original.code}</span>
            )
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
            )
        },
        {
            id: 'description',
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm line-clamp-1">
                    {row.original.description || 'No description'}
                </span>
            )
        },
        {
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: 'Created',
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
                        onClick={() => navigate(`/departments/show/${row.original.id}`)}
                    >
                        View
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/departments/edit/${row.original.id}`)}
                    >
                        Edit
                    </Button>
                </div>
            )
        }
    ], [navigate]);

    const searchFilters = search ? [
        {
            field: 'name',
            operator: 'contains' as const,
            value: search
        }
    ] : [];

    const table = useTable<Department>({
        columns,
        refineCoreProps: {
            resource: 'departments',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: searchFilters
            },
            sorters: {
                initial: [
                    {
                        field: 'id',
                        order: 'desc'
                    }
                ]
            }
        }
    });

    return (
        <ListView>
            <ListViewHeader title="Departments" resource="departments" canCreate={false} />
            <div className="intro-row">
                <div className="search-field">
                    <Search className="search-icon" />
                    <Input
                        placeholder="Search by name or code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="actions-row">
                    <Button onClick={() => navigate('/departments/create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Department
                    </Button>
                </div>
            </div>

            <DataTable table={table} />
        </ListView>
    );
};

export default DepartmentsList;
