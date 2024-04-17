import { AdminDto } from '../dto/adminDto.js';
import ReportDto from '../dto/reportDto.js';
import { ApiError } from '../exeptions/apiError.js';
import Admin from '../models/adminModel.js';
import Report from '../models/reportModel.js';

class ReportService {
    async create(req) {
        try {
            const admin = await Admin.findById(req.adminId);
            if (!admin) {
                throw ApiError.NotFoundExeption('Администратор не найден');
            }
            const newReport = new Report({
                admin: req.adminId,
                details: req.body,
            });
            await newReport.save();
            return { report: new ReportDto(newReport), adminData: new AdminDto(admin) };
        } catch (error) {
            throw error;
        }
    }

    async getOne(id) {
        try {
            const report = await Report.findById(id);
            if (!report) {
                throw ApiError.NotFoundExeption('Отчет не найден');
            }
            return new ReportDto(report);
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const reports = await Report.find();
            if (reports.length === 0) {
                throw ApiError.NotFoundExeption('Отчеты не найдены');
            }
            return reports.map((report) => new ReportDto(report));
        } catch (error) {
            throw error;
        }
    }

    async remove(id) {
        try {
            await Report.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async removeAll() {
        try {
            return await Report.deleteMany({});
        } catch (error) {
            throw error;
        }
    }
}

export default new ReportService();
