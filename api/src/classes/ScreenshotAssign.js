module.exports = class ScreenshotAssign {
    constructor(scrID, id, staff, date){
        this.screenshotID = scrID;
        this.playerID = id;
        this.staff = staff;
        this.date = date;
        this.state = false;
        this.requested = false;
        this.imageURL = null;
    }
}