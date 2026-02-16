using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartEmergency.API.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceProviderIdToBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceProviderId",
                table: "Bookings",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceProviderId",
                table: "Bookings");
        }
    }
}
