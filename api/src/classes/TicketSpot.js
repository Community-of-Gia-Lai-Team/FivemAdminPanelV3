module.exports = class StaffSpot {
    constructor(tkid, staff, type, userData, date, allowedStaff, reason, comment){
        this.tkid = tkid;
        this.staff = staff;
        this.type = type;
        this.userData = userData;
        this.date = date;
        this.allowedStaff = allowedStaff;
        this.reason = reason;
        this.comment = comment;
    }
}