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

        public DbSet<TherapySession> TherapySessions { get; set; }

       public DbSet<TreatmentPlan> TreatmentPlans { get; set; }
        public DbSet<TreatmentPlanUshtrimi> TreatmentPlanUshtrimet { get; set; }

        public DbSet<Ushtrimi> Ushtrimet { get; set; }

        //ketu i bejme te tjerat
        //

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Kompozim: një psikolog ka shumë takime
            modelBuilder.Entity<Psikologi>().ToTable("Psikologet");

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Psikolog)
                .WithMany()
                .HasForeignKey(a => a.PsikologId)
                .OnDelete(DeleteBehavior.Restrict); // kur fshihet psikologu, takimet nuk fshihen automatikisht

            // Kompozim: një pacient ka shumë takime
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade); // kur fshihet pacienti, fshihen automatikisht takimet

            // Raportet kompozim
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


            // TherapySessions kompozim
            modelBuilder.Entity<TherapySession>()
                .HasOne(t => t.Psikologi)
                .WithMany()
                .HasForeignKey(t => t.PsikologId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TherapySession>()
                .HasOne(t => t.Patient)
                .WithMany()
                .HasForeignKey(t => t.PatientId);

            modelBuilder.Entity<TreatmentPlan>()
            .HasOne(tp => tp.Patient)
            .WithMany()
            .HasForeignKey(tp => tp.PatientId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<TreatmentPlan>()
                .HasOne(tp => tp.Psikolog)
                .WithMany()
                .HasForeignKey(tp => tp.PsikologId)
                .OnDelete(DeleteBehavior.NoAction);
            // TreatmentPlanUshtrimi:

            modelBuilder.Entity<TreatmentPlanUshtrimi>()
            .HasKey(tu => tu.TreatmentPlanUshtrimiId);

            modelBuilder.Entity<TreatmentPlanUshtrimi>()
                .HasOne(tu => tu.TreatmentPlan)
                .WithMany(tp => tp.TreatmentPlanUshtrimet)
                .HasForeignKey(tu => tu.TreatmentPlanId)

                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Ushtrimi>().ToTable("Ushtrimet");

         
        }

    }
}
    
