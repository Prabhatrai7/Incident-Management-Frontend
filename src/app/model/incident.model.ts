export interface Incident {
    id?: number;
    incidentId: string;
    reporterName: string;
    reporterUserId: number;
    details: string;
    reportedDate: Date;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In progress' | 'Closed';
    userType: 'Individual' | 'Enterprise' | 'Government';
}