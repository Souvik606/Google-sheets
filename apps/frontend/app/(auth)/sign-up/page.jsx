"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { registerSchema } from "@/schemas/authSchemas";
import Link from "next/link";

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      image: null,
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    // TODO: signup logic
    console.log("Sign up data:", data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 bg-gradient-to-br from-purple-100 to-teal-200">
      <Card className="w-full max-w-md p-8">
        <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      // Pass the FileList to the form field
                      onChange={(e) => field.onChange(e.target.files)}
                      accept="image/*"
                      className="file:rounded file:border file:border-gray-300 file:bg-gray-100 file:px-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">Already have an account?</p>
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            Log In
          </Link>
        </div>
      </Card>
    </div>
  );
}
