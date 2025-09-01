using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinanceApp.Server.Models;

public class Transaction
{
    private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };
    
    [JsonPropertyName("date")]
    public DateOnly? Date { get; set; }
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("type")]
    public string? Type { get; set; }
    
    [JsonPropertyName("amount")]
    public float Amount { get; set; }
    
    [JsonPropertyName("balance")]
    public float Balance { get; set; }
    
    [JsonPropertyName("isPosted")]
    public bool IsPosted { get; set; }

    public override string ToString()
    {
        return JsonSerializer.Serialize(this, _jsonOptions);
    }
}