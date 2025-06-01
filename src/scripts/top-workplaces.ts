import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface Workplace {
    id: string;
    name: string;
}

export interface Shift {
    workplaceId: string;
    workerId: string;
}

export interface TopWorkPlaces {
    name: string;
    shifts: number;
}

@Injectable()
export class TopWorkplacesService {
    constructor() {}

    async getTopWorkplaces(): Promise<TopWorkPlaces[]> {
        try {
            const [workplaceResponse, shiftsResponse] = await Promise.all([
                axios.get('http://localhost:3000/workplaces'),
                axios.get('http://localhost:3000/shifts'),
            ]);

            const workplaces: Workplace[] = await workplaceResponse.data.data;
            const shifts: Shift[] = await shiftsResponse.data.data;

            const shiftCounts = shifts.reduce((acc: Record<string, number>, shift: Shift) => {
                acc[shift.workplaceId] = (acc[shift.workplaceId] || 0) + 1;
                return acc;
            }, {});

            const topWorkplaces = workplaces
                .map((workplace: Workplace) => ({
                    name: workplace.name,
                    shifts: shiftCounts[workplace.id] || 0,
                }))
                .sort((a: TopWorkPlaces, b: TopWorkPlaces) => b.shifts - a.shifts)
                .slice(0, 3);

            console.log(topWorkplaces);
            return topWorkplaces;
        } catch (error) {
            console.error('Error fetching workplaces:', error);
            return [];
        }
    }
}

// Initialize and run the script
async function run() {
    const service = new TopWorkplacesService();
    await service.getTopWorkplaces();
}

run();