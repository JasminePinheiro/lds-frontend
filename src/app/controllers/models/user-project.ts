import { UserProjectTaskModel } from "./user-project-task";

export interface UserProjectModel {
    name: string;
    tasks: UserProjectTaskModel[];
    username: string;
}