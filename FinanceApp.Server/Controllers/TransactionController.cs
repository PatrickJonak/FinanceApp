using Microsoft.AspNetCore.Mvc;
using FinanceApp.Server.Models;

namespace FinanceApp.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class TransactionController(ILogger<TransactionController> logger) : ControllerBase
{
    private readonly ILogger<TransactionController> _logger = logger;
    
    private readonly string[] _descriptions =
        [ "ACME Corp.", "Wayne Industries", "Calamity Ins.", "Electric. Co.", "CCAT" ];
    private readonly string[] _types =
        [ "Direct Payment", "Withdrawal", "Debit Card"];

    [HttpGet(Name = "GetTransactions")]
    public IEnumerable<Transaction> Get()
    {
        // Initialize values
        var balance = Random.Shared.Next(0, 1000);
        List<Transaction> transactions = [];
        
        // Create 10 transactions
        for (var i = 10; i > 0; i--)
        {
            // Compute and set values
            var date = DateOnly.FromDateTime(DateTime.Now.AddDays(-i));
            var description = _descriptions[Random.Shared.Next(_descriptions.Length)];
            string type;
            int amount;
            if (description == "CCAT")
            {
                amount = 1000;
                type = "Direct Deposit";
            }
            else
            {
                amount = -Random.Shared.Next(1, 100);
                type = _types[Random.Shared.Next(0, _types.Length)];         
            }
            balance += amount;
            
            // Add transaction
            transactions.Add(new Transaction
            {
                Date = date,
                Description = description,
                Type = type,
                Amount = amount,
                Balance = balance,
                IsPosted = true
            });
        }
        return transactions;
    }
}