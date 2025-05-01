  namespace BlackJackApi.Models;
  
  public class User
  {
      public long Id { get; set; }
      public string? Username { get; set; }
      public string? Password { get; set; }
      public int Cash { get; set; }
  }