import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import VaultItemModel from '@/models/VaultItem';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const items = await VaultItemModel.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Vault GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, username, password, url, notes } = await req.json();

    if (!title || !username || !password) {
      return NextResponse.json(
        { error: 'Title, username, and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await VaultItemModel.create({
      userId: session.user.id,
      title,
      username,
      password,
      url: url || '',
      notes: notes || '',
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Vault POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}