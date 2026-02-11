import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BACKEND_BASE_URL } from '@/constants';
import {
  AnalyticsOverview,
  EnrollmentTrend,
  ClassesByDepartment,
  CapacityStatus,
  UserDistribution,
  RecentActivity
} from '@/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Users, GraduationCap, Building2, UserCheck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

const Dashboard = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [enrollmentTrends, setEnrollmentTrends] = useState<EnrollmentTrend[]>([]);
  const [classesByDept, setClassesByDept] = useState<ClassesByDepartment[]>([]);
  const [capacityStatus, setCapacityStatus] = useState<CapacityStatus | null>(null);
  const [userDistribution, setUserDistribution] = useState<UserDistribution[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch all analytics data
        const [overviewRes, trendsRes, deptRes, capacityRes, distRes, activityRes] = await Promise.all([
          fetch(`${BACKEND_BASE_URL}/api/analytics/overview`),
          fetch(`${BACKEND_BASE_URL}/api/analytics/enrollment-trends`),
          fetch(`${BACKEND_BASE_URL}/api/analytics/classes-by-department`),
          fetch(`${BACKEND_BASE_URL}/api/analytics/capacity-status`),
          fetch(`${BACKEND_BASE_URL}/api/analytics/user-distribution`),
          fetch(`${BACKEND_BASE_URL}/api/analytics/recent-activity`)
        ]);

        const [overviewData, trendsData, deptData, capacityData, distData, activityData] = await Promise.all([
          overviewRes.json(),
          trendsRes.json(),
          deptRes.json(),
          capacityRes.json(),
          distRes.json(),
          activityRes.json()
        ]);

        setOverview(overviewData.data);
        setEnrollmentTrends(trendsData.data || []);
        setClassesByDept(deptData.data || []);
        setCapacityStatus(capacityData.data);
        setUserDistribution(distData.data || []);
        setRecentActivity(activityData.data || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const CAPACITY_COLORS = {
    available: '#10b981',
    nearFull: '#eab308',
    almostFull: '#f97316',
    full: '#ef4444'
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <p className="loading">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="quick-actions">
          <Button onClick={() => navigate('/classes/create')} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe' }}>
            <Users className="w-6 h-6" style={{ color: '#0284c7' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{overview?.totalUsers || 0}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
            <GraduationCap className="w-6 h-6" style={{ color: '#16a34a' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Classes</p>
            <p className="stat-value">{overview?.totalClasses || 0}</p>
            <p className="stat-subtitle">{overview?.activeClasses || 0} active</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <UserCheck className="w-6 h-6" style={{ color: '#ca8a04' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Enrollments</p>
            <p className="stat-value">{overview?.totalEnrollments || 0}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff' }}>
            <Building2 className="w-6 h-6" style={{ color: '#9333ea' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Departments</p>
            <p className="stat-value">{overview?.totalDepartments || 0}</p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Enrollment Trends */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>Enrollment Trends</h3>
            <p className="chart-subtitle">Last 30 days</p>
          </div>
          <div className="chart-content">
            {enrollmentTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={2} name="Enrollments" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No enrollment data available</p>
            )}
          </div>
        </Card>

        {/* Classes by Department */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>Classes by Department</h3>
            <p className="chart-subtitle">Distribution across departments</p>
          </div>
          <div className="chart-content">
            {classesByDept.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classesByDept}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="departmentName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="classCount" fill="#16a34a" name="Classes" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No department data available</p>
            )}
          </div>
        </Card>

        {/* Capacity Status */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>Class Capacity Status</h3>
            <p className="chart-subtitle">Utilization overview</p>
          </div>
          <div className="chart-content">
            {capacityStatus && Object.values(capacityStatus.categories).some(v => v > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Available (<70%)', value: capacityStatus.categories.available },
                      { name: 'Near Full (70-90%)', value: capacityStatus.categories.nearFull },
                      { name: 'Almost Full (90-100%)', value: capacityStatus.categories.almostFull },
                      { name: 'Full (100%)', value: capacityStatus.categories.full }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.keys(CAPACITY_COLORS).map((key, index) => (
                      <Cell key={`cell-${index}`} fill={CAPACITY_COLORS[key as keyof typeof CAPACITY_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No capacity data available</p>
            )}
          </div>
        </Card>

        {/* User Distribution */}
        <Card className="chart-card">
          <div className="chart-header">
            <h3>User Distribution</h3>
            <p className="chart-subtitle">By role</p>
          </div>
          <div className="chart-content">
            {userDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.role}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {userDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">No user data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="activity-card">
        <div className="activity-header">
          <h3>Recent Activity</h3>
          <Badge variant="outline">{recentActivity.length} activities</Badge>
        </div>
        <div className="activity-feed">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="activity-item">
                <div className="activity-icon" data-type={activity.type}>
                  {activity.type === 'enrollment' && <UserCheck className="w-4 h-4" />}
                  {activity.type === 'class' && <GraduationCap className="w-4 h-4" />}
                  {activity.type === 'user' && <Users className="w-4 h-4" />}
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <p className="activity-time">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;