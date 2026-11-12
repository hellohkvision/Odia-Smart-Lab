"""Browser integration checks; run with Python Playwright on a browser-capable host."""
from pathlib import Path
import os
import shutil
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1] / 'app/src/main/assets'
URL = (ROOT / 'index.html').as_uri()


def open_hub(page):
    page.locator('#activityMenu').click()
    page.locator('#literatureMenu').click()
    expect(page.locator('#literatureHub')).to_be_visible()
    page.locator('#litSelectBook button').click()
    expect(page.locator('#litTitle')).to_have_text('ସାହିତ୍ୟ ସୁଧା')
    expect(page.locator('#litChapterList')).to_have_count(0)
    page.locator('#litBookActivity').click()
    expect(page.locator('#litTitle')).to_contain_text('ପାଠ ବାଛନ୍ତୁ')
    expect(page.locator('#litOpenChapter')).to_contain_text('ଜନ୍ମଭୂମି')
    page.locator('#litOpenChapter').click()
    expect(page.locator('.lit-card')).to_have_count(6)


def activity(page, name):
    page.locator('.lit-card').filter(has=page.locator('strong', has_text=name)).click()


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'))
        page = browser.new_page(viewport={'width': 1366, 'height': 768})
        errors = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        page.goto(URL)
        page.locator('#startupScreen').wait_for(state='detached')
        # Existing ink must survive every activity, close, and reload.
        page.mouse.move(400, 180)
        page.mouse.down()
        page.mouse.move(480, 230, steps=12)
        page.mouse.up()
        before = page.evaluate("localStorage.getItem('odia-board-user-1')")
        assert before is not None
        open_hub(page)
        activity(page, 'ଚିତ୍ରରେ ଖୋଜିବା')
        for b in page.locator('.lit-hotspots button').all():
            b.click()
        page.locator('#litBack').click()
        activity(page, 'ଶବ୍ଦ ଯୋଡ଼ିବା')
        words = ['ହିମାଳୟ', 'ଜାହ୍ନବୀ', 'ମହୋଦଧି', 'ଜନନୀ', 'ଦୁହିତା', 'ଚରଣ']
        meanings = ['ଭାରତର ଉତ୍ତରରେ ଥିବା ପର୍ବତମାଳା', 'ଗଙ୍ଗା ନଦୀର ଅନ୍ୟ ନାମ', 'ମହାସାଗର', 'ମାଆ', 'ଝିଅ', 'ପାଦ']
        # Wrong pair stays available, then all correct pairs become disabled.
        page.get_by_role('button', name=words[0], exact=True).click()
        page.get_by_role('button', name=meanings[1], exact=True).click()
        expect(page.locator('.lit-feedback')).to_contain_text('ପୁଣି')
        for w, m in zip(words, meanings):
            page.get_by_role('button', name=w, exact=True).click()
            page.get_by_role('button', name=m, exact=True).click()
        assert page.locator('.lit-match button:disabled').count() == 12
        page.locator('#litBack').click()
        activity(page, 'ନିଜକୁ ପରଖିବା')
        correct = ['ମଧୁସୂଦନ ରାଓ', 'ହିମାଳୟ', 'ଗଙ୍ଗା', 'ଜନ୍ମଭୂମି ପ୍ରତି ଭଲପାଇବା ଓ ଶ୍ରଦ୍ଧା', 'ସଚ୍ଚିଦାନନ୍ଦ ରାଉତରାୟ', 'ପରିବେଶକୁ ସଫା ରଖି ଓ ଗଛ ଲଗାଇ']
        for i, answer in enumerate(correct):
            if i == 0:
                page.get_by_role('button', name='ସହାୟତା', exact=True).click()
            page.get_by_role('button', name=answer, exact=True).click()
            page.locator('.lit-actions .lit-primary').click()
        expect(page.locator('.lit-results')).to_contain_text('5 / 6')
        page.locator('#litBack').click()
        activity(page, 'ବାକ୍ୟ ସଜାଇବା')
        for sentence in [['ଆମେ', 'ଜନ୍ମଭୂମିକୁ', 'ଭଲ', 'ପାଉ।'], ['ହିମାଳୟ', 'ଭାରତର', 'ଉତ୍ତରରେ', 'ଅଛି।'], ['ଆମେ', 'ନଦୀକୁ', 'ସଫା', 'ରଖିବା।']]:
            for word in sentence:
                page.locator('.lit-chips').get_by_role('button', name=word, exact=True).click()
            page.get_by_role('button', name='ଯାଞ୍ଚ କରନ୍ତୁ', exact=True).click()
            page.locator('.lit-actions button:not([disabled])').last.click()
        activity(page, 'ମୋ ଗାଁ, ମୋ କଥା')
        page.locator('#litDraft').fill('ମୋ ଗାଁ ସୁନ୍ଦର। ମୁଁ ଗଛ ଲଗାଇବି।')
        page.locator('.lit-actions button').click()
        page.locator('#litBack').click()
        activity(page, 'ଦୁଇ କବିତା, ଏକ ଭାବ')
        page.locator('.lit-actions button').click()
        page.keyboard.press('Escape')
        expect(page.locator('#literatureHub')).not_to_be_visible()
        expect(page.locator('#activityMenu')).to_be_focused()
        assert page.evaluate("localStorage.getItem('odia-board-user-1')") == before
        page.reload()
        page.locator('#startupScreen').wait_for(state='detached')
        open_hub(page)
        assert page.locator('.lit-complete').count() == 6
        # Back navigation follows chapter → chapter list → book → catalog.
        page.locator('#litBack').click()
        expect(page.locator('#litChapterList')).to_be_visible()
        page.locator('#litBack').click()
        expect(page.locator('#litBookActivity')).to_be_visible()
        page.locator('#litBack').click()
        expect(page.locator('#litSelectBook')).to_be_visible()
        page.locator('#litSelectBook button').click()
        page.locator('#litBookActivity').click()
        page.locator('#litOpenChapter').click()
        activity(page, 'ମୋ ଗାଁ, ମୋ କଥା')
        expect(page.locator('#litDraft')).to_have_value('ମୋ ଗାଁ ସୁନ୍ଦର। ମୁଁ ଗଛ ଲଗାଇବି।')
        for width, height in [(1920, 1080), (844, 390), (390, 844)]:
            page.set_viewport_size({'width': width, 'height': height})
            assert page.locator('#literatureHub').evaluate('(el)=>el.scrollWidth <= innerWidth')
            assert page.locator('#litClose').bounding_box()['height'] >= 48
        assert not errors, errors
        browser.close()
        print('PASS: activities, scoring, draft persistence, board preservation, focus, viewport overflow')


if __name__ == '__main__':
    from functools import partial
    from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
    from threading import Thread
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    URL = f'http://127.0.0.1:{server.server_port}/'
    try:
        run()
    finally:
        server.shutdown()
        server.server_close()
