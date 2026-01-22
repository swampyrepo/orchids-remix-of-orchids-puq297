import { ImageResponse } from 'next/og';
import { supabaseClient } from '@/lib/supabase-client';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
      return new Response('Profile not found', { status: 404 });
    }

    const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || 'User'}&background=161B22&color=58A6FF`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0D1117',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #161B22 2%, transparent 0%), radial-gradient(circle at 75px 75px, #161B22 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#161B22',
              borderRadius: '24px',
              padding: '60px',
              border: '2px solid #30363D',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              width: '80%',
            }}
          >
            <img
              src={avatarUrl}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '6px solid #4361EE',
                marginBottom: '30px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  margin: '0 0 10px 0',
                  textAlign: 'center',
                }}
              >
                {profile.full_name || 'Guest User'}
              </h1>
              <h2
                style={{
                  fontSize: '32px',
                  color: '#4361EE',
                  margin: '0 0 20px 0',
                  fontWeight: 'medium',
                }}
              >
                @{profile.username || `user${profile.user_number}`}
              </h2>
              {profile.bio && (
                <p
                  style={{
                    fontSize: '24px',
                    color: '#8B949E',
                    margin: '0',
                    textAlign: 'center',
                    maxWidth: '500px',
                    lineHeight: '1.4',
                  }}
                >
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
             <span style={{ color: '#8B949E', fontSize: '20px' }}>vreden.my.id/users/profile</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
