import requests
import re

FRONTEND_URL = "https://kiranbcrkbc-nutrivision-ai.onrender.com"

print("=" * 70)
print(f"VERIFYING FRONTEND DEPLOYMENT AT {FRONTEND_URL}")
print("=" * 70)

r = requests.get(FRONTEND_URL, timeout=15)
print(f"Landing Page Status: HTTP {r.status_code}")
assert r.status_code == 200, f"Expected 200, got {r.status_code}"
assert "<title>" in r.text.lower(), "Missing <title> tag in HTML"
print("Landing Page HTML received successfully.")

# Extract title
title_match = re.search(r"<title>(.*?)</title>", r.text, re.IGNORECASE)
if title_match:
    print(f"Page Title: {title_match.group(1)}")

# Find script tags
scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', r.text)
links = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', r.text)

print(f"\nFound {len(scripts)} scripts and {len(links)} links:")

for s in scripts:
    s_url = s if s.startswith("http") else FRONTEND_URL.rstrip("/") + ("/" if not s.startswith("/") else "") + s
    res = requests.get(s_url, timeout=15)
    print(f"  Script: {s} -> HTTP {res.status_code} ({len(res.content)} bytes)")
    assert res.status_code == 200, f"Failed to load script {s}"
    
    # Check if backend URL is present in the JS bundle
    if "kiranbcrkbc-nutrivision-backend.onrender.com" in res.text:
        print("    [CONFIRMED] Production Backend URL (https://kiranbcrkbc-nutrivision-backend.onrender.com) is compiled into the client bundle!")
    if "kiranbcrkbc-nutrivision-ai-service.onrender.com" in res.text:
        print("    [CONFIRMED] Production AI Service URL is compiled into the client bundle!")

for l in links:
    if "stylesheet" in r.text and (".css" in l or "assets" in l):
        l_url = l if l.startswith("http") else FRONTEND_URL.rstrip("/") + ("/" if not l.startswith("/") else "") + l
        res = requests.get(l_url, timeout=15)
        print(f"  Stylesheet: {l} -> HTTP {res.status_code} ({len(res.content)} bytes)")
        assert res.status_code == 200, f"Failed to load stylesheet {l}"

# Test client-side routing fallback (SPA Rewrite rule)
routes_to_test = ["/demo", "/login", "/register", "/dashboard", "/about", "/disclaimer"]
print("\nTesting SPA Rewrite Routes:")
for route in routes_to_test:
    r_route = requests.get(FRONTEND_URL + route, timeout=15)
    print(f"  Route {route} -> HTTP {r_route.status_code}")
    assert r_route.status_code == 200, f"Route {route} failed with {r_route.status_code}"
    assert "<div id=\"root\">" in r_route.text or "<div id='root'>" in r_route.text or "id=\"root\"" in r_route.text, f"Route {route} did not return SPA index.html"

print("\n" + "=" * 70)
print("FRONTEND VERIFICATION: ALL ASSETS & ROUTES PASSED 100%")
print("=" * 70)
