using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MentalHealthSystemManagement.Domain.Entities;

namespace MentalHealthSystemManagement.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Psikologi> Psikologet { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<HealthReports> HealthReports { get; set; }
        //ketu i bejme te tjerat
        //

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Psikologi>().ToTable("Psikologet");
            //Kompozim: nje psikolog ka shume takime
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Psikologi)
                .WithMany()
                .HasForeignKey(a => a.PsikologId)
                .OnDelete(DeleteBehavior.Restrict); // nese fshihet psikologu fshihet edhe takimi 

            //kompozim: nje pacient ka shume takime
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade); // i bie qe nese fshihet pacienti fsihet edhe takimi


            //raportet kompozim
            modelBuilder.Entity<HealthReports>()
                .HasOne(r => r.Psikologi)
                .WithMany()
                .HasForeignKey(r => r.PsikologId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HealthReports>()
                .HasOne(r => r.Patient)
                .WithMany()
                .HasForeignKey(r => r.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
    
}