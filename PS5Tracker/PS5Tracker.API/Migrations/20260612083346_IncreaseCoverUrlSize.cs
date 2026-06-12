using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PS5Tracker.API.Migrations
{
    /// <inheritdoc />
    public partial class IncreaseCoverUrlSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SteamAppId",
                table: "Games");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SteamAppId",
                table: "Games",
                type: "text",
                nullable: true);
        }
    }
}
