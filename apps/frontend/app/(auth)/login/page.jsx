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
import { loginSchema } from "@/schemas/authSchemas";
import Link from "next/link";
import { loginService } from "@/services/authentication";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, data, isSuccess, isError, isPending, error } = useMutation({
    mutationFn: ({ email, password }) => loginService({ email, password }),
    mutationKey: ["userLogin"],
    onSuccess: () => {
      console.log("Successfully logged in!");
    },
    retry: false,
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 bg-gradient-to-br from-purple-100 to-teal-200">
      <Card className="w-full max-w-md p-8">
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
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
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">Don&apos;t have an account?</p>
          <Link
            href="/sign-up"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            Sign Up
          </Link>
        </div>
        {isError ? <p>{error}</p> : ""}
      </Card>
    </div>
  );
}
