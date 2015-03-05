// ========================================================================
// =                               Sequence                               =
// ========================================================================
var sq = function(func) {
	var __sq = {
		__next: null,
		__cancel: false,
		__finalSuccessFuncs: [],
		__finalFailFuncs: [],
		__finalAlwaysFuncs: [],
		__successed: false,
		__failed: false,
		__finalArguments: null,
		doStart: function() {
			__sq.__next.execute.apply(__sq.__next, arguments);
		},
	};

	function doFuncs(funcList, args) {
		funcList.forEach(function(_func) {
			_func.apply(this, args);
		});
	}

	var Next = function() {
		var _my = this;

		var __func = null;
		var __next = null;
		var __successFuncs = [];
		var __failFuncs = [];
		var __alwaysFuncs = [];

		var __sqList = null;

		_my.setFunc = function(func) {
			__func = func;
		};
		_my.getFunc = function() {
			return __func;
		};
		_my.setSQList = function(list) {
			__sqList = list;

			list.forEach(function(mnext) {
				mnext.finalSuccess(function() {
					doSuccess.apply(this, arguments);
				});
				mnext.finalFail(function() {
					doFail.apply(this, arguments);
				});
			});
		};

		_my.next = function(func) {
			__next = new Next();

			if(func !== undefined && func !== null && func.isSQ) {
				__next.setSQList([func]);
			} else {
				__next.setFunc(func);
			}
			return __next;
		};
		_my.isSQ = true;
		_my.getRoot = function() {
			return __sq;
		};

		function doSuccess() {
			doFuncs(__alwaysFuncs, arguments);
			doFuncs(__successFuncs, arguments);

			if(!__next) {
				__sq.__successed = true;
				__sq.__finalArguments = arguments;
				doFuncs(__sq.__finalAlwaysFuncs, arguments);
				doFuncs(__sq.__finalSuccessFuncs, arguments);
			}
		};
		function doFail() {
			doFuncs(__alwaysFuncs, arguments);
			doFuncs(__failFuncs, arguments);

			__sq.__failed = true;
			__sq.__finalArguments = arguments;
			doFuncs(__sq.__finalAlwaysFuncs, arguments);
			doFuncs(__sq.__finalFailFuncs, arguments);
		};
		_my.execute = function() {
			var args = arguments;
			try {
				var caller = {
					success: function() {
						if(__sq.__cancel) return;

						doSuccess.apply(this, arguments);

						if(__next) {
							__next.execute.apply(this, arguments);
						}
					},
					fail: function() {
						if(__sq.__cancel) return;

						doFail.apply(this, arguments);
					},
				};
				caller.result = function(ret) {
					var args = Array.prototype.slice.call(arguments, 1);
					if(ret) {
						caller.success.apply(this, args);
					} else {
						caller.fail.apply(this, args);
					}
				};

				if(__func) {
					var _args = [caller].concat(Array.prototype.slice.apply(args));
					__func.apply(this, _args);
				} else if(__sqList) {
					__sqList.forEach(function(__sq) {
						__sq.start.apply(this, args);
					});
				}
			} catch(e) {
				if(__sq.__cancel) {
					throw e;
				} else {
					__sq.__cancel = true;
					doFail(e);
					throw e;
				}

			}
		};

		_my.success = function(_func) {
			__successFuncs.push(_func);
			return _my;
		};
		_my.fail = function(_func) {
			__failFuncs.push(_func);
			return _my;
		};
		_my.always = function(_func) {
			__alwaysFuncs.push(_func);
			return _my;
		};

		_my.finalSuccess = function(_func) {
			__sq.__finalSuccessFuncs.push(_func);
			if(__sq.__successed) _func(__sq.__finalArguments);

			return _my;
		};
		_my.finalFail = function(_func) {
			__sq.__finalFailFuncs.push(_func);
			if(__sq.__failed) _func(__sq.__finalArguments);
			return _my;
		};
		_my.finalAlways = function(_func) {
			__sq.__finalAlwaysFuncs.push(_func);
			if(__sq.__successed || __sq.__failed) _func(__sq.__finalArguments);
			return _my;
		};

		_my.start = function() {
			__sq.doStart.apply(this, arguments);
			return _my;
		};
		_my.cancel = function() {
			__sq.__cancel = true;
			return _my;
		};

		return _my;
	};

	__sq.__next = new Next();
	__sq.__next.setFunc(func);
	return __sq.__next;
};
