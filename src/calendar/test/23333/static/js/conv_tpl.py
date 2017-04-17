#!/usr/bin/python
# -*- coding: utf-8 -*-

from HTMLParser import HTMLParser
import re
import os
import time


class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.links = {}
        self.tag_now = ""
        self.endtag = ['br', 'img']

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.tag_now = ""
            for (name, value) in attrs:
                if name == "id":
                    self.tag_now = value
                    self.links[self.tag_now] = ""

            if len(self.tag_now) == 0:
                print "error: a script tag without id"
        else:
            if len(self.tag_now):
                self.links[self.tag_now] += "<" + tag
                for (name, value) in attrs:
                    self.links[self.tag_now] += ' ' + name + '="' + value + '"'
                if(tag in self.endtag):
                    self.links[self.tag_now] += ' />'
                else:
                    self.links[self.tag_now] += '>'

    def handle_endtag(self, tag):
        if len(self.tag_now) and (tag not in self.endtag) and (tag != 'script'):
            self.links[self.tag_now] += "</" + tag + ">"

    def handle_data(self, data):
        if len(self.tag_now):

            # 删除掉模板中的注释
            comment = re.compile(r'<!--[\s\S]*?-->')
            data = comment.sub('', data)
            self.links[self.tag_now] += data


def convert(dir_path):

    file_html = open(os.path.join(dir_path, 'tpls.html'), 'r')
    file_js = open(os.path.join(dir_path, 'tpls.js'), 'wb')

    file_html_content = file_html.read()

    if "'" in file_html_content:
        print "error: you should not use single quotes\n"
        file_html.close()
        file_js.close()
        return 1
    hp = MyHTMLParser()
    hp.feed(file_html_content)
    hp.close()

    js = []

    space = re.compile(r'\s*$\s*|^\s*', re.M)
    for k in hp.links.keys():

        abde = space.sub('',  hp.links[k])
        js.append("BAZI.tpls." + k + " = '" + abde + "';\n\n")

    if len(js):
        js.insert(0, "BAZI.tpls = BAZI.tpls || {};\n\n")

    file_js.writelines(js)
    file_html.close()
    file_js.close()
    print 'done! \n'

if __name__ == "__main__":
    mtime = 0
    path = os.path.realpath(__file__)
    dir_path = os.path.dirname(path)

    while True:
        m = os.path.getmtime(os.path.join(dir_path, 'tpls.html'))
        if m != mtime:
            convert(dir_path)
            mtime = m
        time.sleep(1)
