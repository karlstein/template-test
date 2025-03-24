# Get and set env variables
ENVFILE=$1
while ! [ -f "$ENVFILE" ]; do
    read -p "Invalid ENV File directory, Please make sure your env project"
done

set -a
. $ENVFILE
set +a

cd frontend
cp .env.example .env.local

DATABASE_URL="'postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB'"
sed -i -e 's|DATABASE_URL=.*|DATABASE_URL='$DATABASE_URL'|' .env.local
sed -i -e 's|NEXT_PUBLIC_GOOGLE_ID=.*|NEXT_PUBLIC_GOOGLE_ID='$NEXT_PUBLIC_GOOGLE_ID'|' .env.local
sed -i -e 's|NEXT_PUBLIC_GOOGLE_SECRET=.*|NEXT_PUBLIC_GOOGLE_SECRET='$NEXT_PUBLIC_GOOGLE_SECRET'|' .env.local
sed -i -e 's|NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL='$NEXT_PUBLIC_BASE_URL'|' .env.local
sed -i -e 's|NEXTAUTH_URL=.*|NEXTAUTH_URL='$NEXTAUTH_URL'|' .env.local

pnpm install
pnpm run dev
cd ..