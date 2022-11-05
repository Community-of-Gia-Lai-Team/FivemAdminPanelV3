module.exports = class StaffSpot {
    constructor(id, username, joinDate, permission, staff, isDesktop, isOnline){
        this.id = id;
        this.username = username;
        this.joinDate = joinDate;
        this.permission = permission;
        this.staff = staff;
        this.isDesktop = isDesktop;
        this.isOnline = isOnline;
    }
}