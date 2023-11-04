import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const FORM_VALIDATE_API_ROUTE = "http://domainone.com/api/sso/form";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const {
      type,
      field,
      from,
    }: {
      type: string;
      field: string;
      from: string;
    } = payload;

    // For Login Page
    if (from === "login") {
      if (type === "email") {
        const user = await prisma.user.findUnique({
          where: {
            email: field,
          },
        });

        if (user) {
          return NextResponse.json({
            message: "Validate",
          });
        }
        return NextResponse.json(
          {
            message: "User with email not exist!",
          },
          {
            status: 400,
          }
        );
      }
    }

    // For Register Page
    if (from === "register") {
      if (type === "email") {
        const user = await prisma.user.findUnique({
          where: {
            email: field,
          },
        });

        if (user) {
          return NextResponse.json(
            {
              message: "User already exist with email!",
            },
            {
              status: 400,
            }
          );
        }

        return NextResponse.json({
          message: "Validate",
        });
      }

      return NextResponse.json(
        {
          message: "No Req",
        },
        {
          status: 400,
        }
      );
    }

    // For Forget Password Page
    if (from === "forget-password") {
      if (type === "email") {
        const user = await prisma.user.findUnique({
          where: {
            email: field,
          },
        });

        if (!user) {
          return NextResponse.json(
            {
              message: "User not exist with email!",
            },
            {
              status: 400,
            }
          );
        }

        return NextResponse.json({
          message: "Validate",
        });
      }

      return NextResponse.json(
        {
          message: "type not provided!",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "No Req",
      },
      {
        status: 400,
      }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
