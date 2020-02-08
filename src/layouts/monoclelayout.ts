// Copyright (c) 2018-2019 Eon S. Jeon <esjeon@hyunmu.am>
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

class MonocleLayout implements ILayout {
    public readonly description: string = "Monocle";

    public apply(ctx: EngineContext, tileables: Window[], area: Rect): void {
        /* Tile all tileables */
        tileables.forEach((tile) => {
            tile.state = (CONFIG.monocleMaximize)
                ? WindowState.FullTile
                : WindowState.Tile;
            tile.geometry = area;
        });

        /* KWin-specific `monocleMinimizeRest` option */
        if (ctx.backend === KWinDriver.backendName && KWINCONFIG.monocleMinimizeRest) {
            const tiles = [...tileables];
            ctx.setTimeout(() => {
                const current = ctx.currentWindow;
                if (current && current.tiled) {
                    tiles.forEach((window) => {
                        if (window !== current)
                            (window.window as KWinWindow).client.minimized = true;
                    });
                }
            }, 50);
        }
    }

    public handleShortcut(ctx: EngineContext, input: Shortcut, data?: any): boolean {
        switch (input) {
            case Shortcut.Up:
            case Shortcut.FocusUp:
            case Shortcut.Left:
            case Shortcut.FocusLeft:
                ctx.moveFocus(-1);
                return true;
            case Shortcut.Down:
            case Shortcut.FocusDown:
            case Shortcut.Right:
            case Shortcut.FocusRight:
                ctx.moveFocus(1);
                return true;
            default:
                return false;
        }
    }

    public toString(): string {
        return "MonocleLayout()";
    }
}
