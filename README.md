#Sequence
����һ���򵥵�Sequence������������߼����жϻ���������������

#ʹ��
###����sequence����
```javascript
var sq = sq(function(caller) {
    // do your logic
    caller.success(args);
});
```
> `sq(func)`���ڴ���һ��sequence���󣬻ص�����`caller.success(args)`���ڸ�֪����ִ�гɹ��������ͨ��`args`�����ݴ��ݸ���һ��sequence����ͬ������Ҳ����ʹ��`caller.fail(args)`��֪��������ʧ�ܡ�����`caller.result(success,args)`ͨ��success��ʶ����֪�ɹ�����ʧ�ܡ�

###�����ν�
```javascript
sq.next(function(caller) {
    // do your logic
    caller.success(args);
});
```
>����Բ��ϵ���`next(func)`������������һ��sequence����

###ִ��sequence����
```javascript
sq.start();
```

###����
####sq.next(func|sq)
>������һ�����У�����`sequence����`��`function`
####sq.start()
>����sequence����
####sq.cancel()
>ȡ��sequence����

####sq.success(func)
>�����ǰsequenceִ�гɹ������
####sq.fail(func)
>�����ǰsequenceִ�гɹ������
####sq.always(func)
>�����ǰsequenceִ�н�������ã����۳ɹ�����ʧ�ܣ�
####sq.finalSuccess(func)
>�����ǰsequence��������ִ�гɹ������
####sq.finalFail(func)
>�����ǰsequence��������ִ��ʧ�������
####sq.finalAlways(func)
>�����ǰsequence��������ִ�н�������ã��������ճɹ����