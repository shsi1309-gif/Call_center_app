from playwright.sync_api import sync_playwright
B=__import__('os').environ.get('APP_URL','http://localhost:5173')
res=[]
def ok(n,c): res.append((n,bool(c))); print(('PASS ' if c else 'FAIL ')+n)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900})
    logs=[]; pg.on('console',lambda m: logs.append(m.text) if m.type in('error','warning') else None); pg.on('pageerror',lambda e:logs.append('ERR '+str(e)))
    pg.goto(B+'/pulse'); pg.wait_for_timeout(600)
    ids=['callcentre-agent','cross-sell-agent','sop-agent','lead-conversion-agent','capture-agent','customer-discussions','callcentre-team','all-stores','avani-coaching','manage-shipment','quotation-tickets','new-hire-onboarding','dm-sunita','dm-priya','dm-raju','avanibot']
    for i in ids:
        pg.goto(B+'/pulse/'+i); pg.wait_for_timeout(150)
        t=pg.inner_text('.chan__messages')
        ok(f'{i}: seeded content, no stub', 'Welcome to sop' not in t and 'Welcome to new-hire' not in t and pg.locator('.msg').count()>=1)
    pg.goto(B+'/pulse/sop-agent'); ok('divider uses channel name', 'Today · sop-agent' in pg.inner_text('.chan__divider'))
    pg.goto(B+'/pulse'); pg.wait_for_timeout(300)
    ok('unread badge on sop-agent', pg.locator('.agent:has-text("sop-agent") .unread').count()==1)
    pg.click('.agent:has-text("sop-agent")'); pg.click('[aria-label="Back to Pulse"]'); pg.wait_for_timeout(200)
    ok('unread cleared after opening', pg.locator('.agent:has-text("sop-agent") .unread').count()==0)
    ok('other badges untouched', pg.locator('.agent:has-text("cross-sell-agent") .unread').count()==1)
    ok('home preview = last message', 'Great attitude Arvind' in pg.locator('.row:has-text("callcentre-team")').inner_text())
    ok('kudos NEW shown', 'NEW' in pg.inner_text('.kudos')); pg.click('.kudos'); pg.keyboard.press('Escape'); ok('kudos NEW cleared', 'NEW' not in pg.inner_text('.kudos'))
    pg.click('.row:has-text("avani-coaching")'); pg.wait_for_timeout(300); n=pg.locator('.msg').count(); pg.fill('input[aria-label^="Message"]','ok will do'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    ok('bot replies in coaching channel', pg.locator('.msg').count()==n+2 and 'AvaniBot' in pg.locator('.msg').last.inner_text())
    pg.click('[aria-label="Back to Pulse"]'); ok('preview updates after send', 'I will track that' in pg.locator('.row:has-text("avani-coaching")').inner_text())
    pg.click('.row:has-text("customer-discussions")'); pg.wait_for_timeout(300); n=pg.locator('.msg').count(); pg.fill('input[aria-label^="Message"]','hi'); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
    ok('no bot reply in human channel', pg.locator('.msg').count()==n+1)
    print('CONSOLE',logs[:5]); print('FAILS',[n for n,c in res if not c]); b.close()
