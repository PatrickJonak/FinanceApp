var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpLogging(o => { });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpLogging();
app.UseHttpsRedirection();

var descriptions = new[]
{
    "ACME Corp.", "Wayne Industries", "Calamity Ins.", "Electric. Co.", "CCAT"
};
var types = new[]
{
    "Direct Payment", "Withdrawal", "Debit Card"
};

app.MapGet("/transactions", () =>
{
    var balance = Random.Shared.Next(0, 1000);
    List<Transaction> transactions = [];
    for (var i = 10; i > 0; i--)
    {

        DateOnly date = DateOnly.FromDateTime(DateTime.Now.AddDays(-i));
        var description = descriptions[Random.Shared.Next(descriptions.Length)];
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
            type = types[Random.Shared.Next(0, types.Length)];         
        }
        balance += amount;
        var transaction = new Transaction(
            date,
            description,
            type,
            amount,
            balance,
            true
        );
        transactions.Add(transaction);
    }
    return transactions;
})
.WithName("GetTransactions")
.WithOpenApi();

app.Run();

record Transaction(DateOnly Date, string Description, string Type, float Amount, float Balance, bool IsPosted);