Cleanup() {
	rm -rf prisma
	rm -rf app
	rm -rf public
	rm -rf build
	rm -rf .cache
	rm .env
	rm -rf node_modules
}

# looks like remix wont build if app is a symlink
Cleanup
cp -r ../prisma prisma
cp -r ../app app
cp ../.env .

cp -r ../public public
rm -rf public/build

npm install
npm run build

docker build -t remix-deploy-test .

# cleanup
Cleanup
