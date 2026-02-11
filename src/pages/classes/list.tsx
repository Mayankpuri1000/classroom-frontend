import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

import { ClassDetails, Subject, User } from "@/types";
import { ShowButton } from "@/components/refine-ui/buttons/show";

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  // Fetch subjects for filter dropdown
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  // Fetch teachers for filter dropdown
  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQuery.data?.data || [];
  const teachers = teachersQuery.data?.data || [];

  const classColumns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        id: "banner",
        accessorKey: "bannerUrl",
        size: 100,
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => {
          const bannerUrl = getValue<string>();
          return bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Class banner"
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        size: 250,
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">{getValue<string>()}</span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        size: 120,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status}
            </Badge>
          );
        },
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 180,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 180,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 100,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        id: 'details',
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
        )
      }
    ],
    [],
  );

  const searchFilters = searchQuery
    ? [
      {
        field: "name",
        operator: "contains" as const,
        value: searchQuery,
      },
    ]
    : [];

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
        {
          field: "subject",
          operator: "eq" as const,
          value: selectedSubject,
        },
      ];

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
        {
          field: "teacher",
          operator: "eq" as const,
          value: selectedTeacher,
        },
      ];

  const classTable = useTable<ClassDetails>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters, ...subjectFilters, ...teacherFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Manage and view all classes in the system.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by class name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject: Subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher: User) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
};

export default ClassesList;
