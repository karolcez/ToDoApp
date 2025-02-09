import { ListItem } from './Collections';
import axios from 'axios';

export interface IFetchAPI {
    getList(signal?: AbortSignal): Promise<ListItem[]>;
}

export class AxiosAPI implements IFetchAPI {
    constructor(public url: string) { }

    getList = async (signal?: AbortSignal): Promise<ListItem[]> => {
        try {
            const response = await axios.get<ListItem[]>(this.url, { signal });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            } else {
                console.error("Error fetching posts:", error);
            }
            return [];
        }
    };
}