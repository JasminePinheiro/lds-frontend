export interface UserProjectTaskModel {
    id: string;
    task_name: string;
    description: string;
    startDate?: number;
    endDate?: number;
    username: string;
}