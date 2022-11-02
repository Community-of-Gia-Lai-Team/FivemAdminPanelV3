using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StaffAPI.Messages;

namespace StaffAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SetupPanelController : ControllerBase
    {
        [HttpPost]
        public ActionResult<SetupPanel> Create(SetupPanel pet)
        {
            return Ok();
        }
    }
}
