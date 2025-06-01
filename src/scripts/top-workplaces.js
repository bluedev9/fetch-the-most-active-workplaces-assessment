const axios = require('axios');

class TopWorkplacesService {
    constructor() {}

    async getTopWorkplaces() {
        try {
            const [workplaceResponse, shiftsResponse] = await Promise.all([
                axios.get('http://localhost:3000/workplaces'),
                axios.get('http://localhost:3000/shifts'),
            ]);

            const workplaces = workplaceResponse.data.data;
            const shifts = shiftsResponse.data.data;

            const shiftCounts = shifts.reduce((acc, shift) => {
                acc[shift.workplaceId] = (acc[shift.workplaceId] || 0) + 1;
                return acc;
            }, {});

            const topWorkplaces = workplaces
                .map(workplace => ({
                    name: workplace.name,
                    shifts: shiftCounts[workplace.id] || 0,
                }))
                .sort((a, b) => b.shifts - a.shifts)
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