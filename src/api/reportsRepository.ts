import { api } from '@/services/api';

class ReportsRepository {
    /**
     * Get top selling products
     * @param granularity - Time granularity (month, year)
     * @param limit - Number of products to return (default: 10)
     */
    async getTopProducts(granularity: 'month' | 'year' = 'month', limit: number = 10) {
        try {
            const response = await api.get('/reports/products/top', {
                params: {
                    granularity,
                    limit
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top products:', error);
            throw error;
        }
    }

    /**
     * Get new users report
     * @param granularity - Time granularity (month, year)
     */
    async getNewUsers(granularity: 'month' | 'year' = 'month') {
        try {
            const response = await api.get('/reports/users/new', {
                params: { granularity }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching new users:', error);
            throw error;
        }
    }
}

const reportsRepository = new ReportsRepository();
export default reportsRepository;
