﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Tasque.Notifications.Data;

#nullable disable

namespace Tasque.Notifications.Migrations
{
    [DbContext(typeof(NotificationsContext))]
    [Migration("20220911121343_CreateNotificationsDb")]
    partial class CreateNotificationsDb
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Tasque.Core.Common.Entities.Notifications.TaskCommentedNotification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CommentId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("TaskId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("TaskCommentedNotifications");
                });

            modelBuilder.Entity("Tasque.Core.Common.Entities.Notifications.TaskMovedNotification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("MovedById")
                        .HasColumnType("integer");

                    b.Property<int>("NewColumnId")
                        .HasColumnType("integer");

                    b.Property<int>("PreviousColumnId")
                        .HasColumnType("integer");

                    b.Property<int>("TaskId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("TaskMovedNotifications");
                });

            modelBuilder.Entity("Tasque.Core.Common.Entities.Notifications.UserInvitedNotification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("InviteeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("InvitorName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("ProjectId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("UserInvitedNotifications");
                });
#pragma warning restore 612, 618
        }
    }
}
