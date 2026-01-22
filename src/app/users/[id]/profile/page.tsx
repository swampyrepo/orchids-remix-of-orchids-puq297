import { Metadata } from 'next';
import { supabaseClient } from '@/lib/supabase-client';
import UserProfileClient from './ProfileClient';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { id } = params;

  let profileQuery = supabaseClient.from("profiles").select("*");
  
  if (!isNaN(Number(id))) {
    profileQuery = profileQuery.eq("user_number", Number(id));
  } else if (id.includes("-") && id.length > 20) {
    profileQuery = profileQuery.eq("id", id);
  } else {
    profileQuery = profileQuery.eq("username", id);
  }

  const { data: profile } = await profileQuery.single();

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  const name = profile.full_name || 'Guest User';
  const username = `@${profile.username || `user${profile.user_number}`}`;
  const bio = profile.bio || 'Check out my profile on Vallzx APIs';
  const baseUrl = 'https://vreden.my.id';
  const ogImageUrl = `${baseUrl}/api/og/profile/${id}`;

  return {
    title: `${name} (${username}) | Vallzx APIs`,
    description: bio,
    openGraph: {
      title: name,
      description: `${username}\n${bio}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s Profile`,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} (${username})`,
      description: bio,
      images: [ogImageUrl],
    },
  };
}

export default function Page() {
  return <UserProfileClient />;
}
