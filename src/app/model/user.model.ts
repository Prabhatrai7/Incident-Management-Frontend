export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    mobileNumber: string;
    fax?: string;
    phone?: string;
    userType: 'Individual' | 'Enterprise' | 'Government';
}