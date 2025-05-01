using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading.Tasks;

namespace BlackJackApi.Controllers;

[ApiController]
[Route("[controller]")]
public class CardsController : ControllerBase
{
    private readonly ILogger<CardsController> _logger;
    private readonly HttpClient _httpClient;

    public CardsController(ILogger<CardsController> logger)
    {
        _logger = logger;
        _httpClient = new HttpClient();
    }

    // Recogemos una 6 barajas mezcladas para iniciar la partida
    [HttpGet("GetDeck")]
    public async Task<IActionResult> GetNewDeck()
    {
        var url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6";

        try
        {
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode) return BadRequest();

            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, $"Error en la llamada API de cartas: {ex.Message}");
        }
    }
}
