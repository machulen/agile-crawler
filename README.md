# A smart yet simple XML analyzer

### Problem

The detailed problem description can be found [here](https://agileengine.bitbucket.io/keFivpUlPMtzhfAy/). In a nutchell: suppose that we are writing a simple web crawler that locates a user-selected element on a web site with frequently changing information. We regularly face an issue that the crawler fails to find the element after minor page updates. After some analysis we decided to make our analyzer tolerant to minor website changes so that we don’t have to update the code every time. Our smart analyzer should find something that looks like “Everything OK” button that can be found by `id="make-everything-ok-button"` on the [original page](https://agileengine.bitbucket.io/keFivpUlPMtzhfAy/samples/sample-0-origin.html).

### Install

    npm i

The only project's dependency is jsdom.

### Usage

    node index.js <input_origin_file_path> <input_other_sample_file_path> [-v]

`-v` makes the output verbose. It should be exactly the third argument. (No need to use minimist or something like it for such a simple project.)
