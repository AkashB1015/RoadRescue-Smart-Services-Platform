using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartEmergency.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingToBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Review",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Review",
                table: "Bookings");
        }
    }
}
