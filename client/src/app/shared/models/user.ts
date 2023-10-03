export interface User {
    id: string;
    email: string;
    displayName: string;
    UserProfilePhoto: string;
    token: string;
    roles: string[];
    rolesCheckbox?: boolean[]; // optional, as it might not always be present
    address?: Address; // optional, as a user might not always have an address
}

export interface Address {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
}