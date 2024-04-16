class ReportDto {
	id;
	admin;
	details;
	constructor(report) {
		this.id = report._id;
		this.admin = report.admin;
		this.details = report.details;
	}
}
export default ReportDto