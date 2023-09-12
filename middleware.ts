import { NextRequest, NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    console.log(`this.is middleware`, request.body)
    
    // 允许静态html跨域
    if(request.method === 'OPTIONS'){
        const response = new NextResponse;
        console.log(`this.is middleware OPTIONS`, request.body)
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}