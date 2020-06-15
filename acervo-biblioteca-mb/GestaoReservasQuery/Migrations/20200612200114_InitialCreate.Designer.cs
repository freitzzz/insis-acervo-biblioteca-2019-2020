﻿// <auto-generated />
using System;
using GestaoReservasQuery.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GestaoReservasQuery.Migrations
{
    [DbContext(typeof(GestaoReservasQueryContext))]
    [Migration("20200612200114_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.5");

            modelBuilder.Entity("GestaoReservasQuery.Model.Reserva", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("dataFim")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("dataInicio")
                        .HasColumnType("TEXT");

                    b.Property<string>("obra")
                        .HasColumnType("TEXT");

                    b.Property<string>("utente")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Reservas");
                });
#pragma warning restore 612, 618
        }
    }
}
